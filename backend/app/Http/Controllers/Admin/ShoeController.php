<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shoe;
use App\Models\ShoeImage;
use App\Models\ShoeSize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ShoeController extends Controller
{
    /* ---------- helpers ---------- */

    // Admin page ke liye shoe ka data (image ka sirf path jata hai, URL React banata hai)
    private function format(Shoe $shoe): array
    {
        $main = $shoe->images->firstWhere('is_main', 1) ?? $shoe->images->first();

        return [
            'id'           => $shoe->shoe_id,
            'name'         => $shoe->name,
            'slug'         => $shoe->slug,
            'description'  => $shoe->description,
            'price'        => $shoe->price,
            'gender'       => $shoe->gender,
            'color'        => $shoe->color,
            'is_new'       => $shoe->is_new,
            'is_active'    => $shoe->is_active,
            'category_ids' => $shoe->categories->pluck('category_id')->values(),
            'categories'   => $shoe->categories->pluck('name')->implode(' / '),
            'image'        => $main ? $main->image_url : null,
            'images'       => $shoe->images->map(fn ($i) => [
                'id'      => $i->image_id,
                'url'     => $i->image_url,
                'is_main' => (bool) $i->is_main,
            ])->values(),
            'sizes'        => $shoe->sizes->map(fn ($s) => [
                'size'  => $s->size,
                'stock' => $s->stock,
            ])->values(),
        ];
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 2;

        while (Shoe::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('shoe_id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }

    private function saveImages(Shoe $shoe, array $files, bool $firstIsMain): void
    {
        $order = (int) ShoeImage::where('shoe_id', $shoe->shoe_id)->max('display_order');

        foreach ($files as $index => $file) {
            $name = time() . '_' . $index . '.' . $file->getClientOriginalExtension();
            $file->storeAs("shoes/{$shoe->shoe_id}", $name, 'public');

            ShoeImage::create([
                'shoe_id'       => $shoe->shoe_id,
                'image_url'     => "/storage/shoes/{$shoe->shoe_id}/{$name}",
                'is_main'       => ($firstIsMain && $index === 0) ? 1 : 0,
                'display_order' => ++$order,
            ]);
        }
    }

    private function saveSizes(Shoe $shoe, array $sizes): void
    {
        foreach ($sizes as $row) {
            ShoeSize::updateOrCreate(
                ['shoe_id' => $shoe->shoe_id, 'size' => $row['size']],
                ['stock' => $row['stock']]
            );
        }
    }

    /* ---------- endpoints ---------- */

    // GET /api/admin/shoes   (saare shoes, active aur band dono)
    public function index()
    {
        $shoes = Shoe::with(['images', 'sizes', 'categories'])
            ->orderBy('shoe_id', 'desc')
            ->get();

        return response()->json($shoes->map(fn ($s) => $this->format($s))->values());
    }

    // GET /api/admin/shoes/{id}
    public function show(int $id)
    {
        $shoe = Shoe::with(['images', 'sizes', 'categories'])->findOrFail($id);

        return response()->json($this->format($shoe));
    }

    // POST /api/admin/shoes   (multipart/form-data)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:150',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'gender'         => 'required|in:Male,Female,Unisex',
            'color'          => 'nullable|string|max:30',
            'is_new'         => 'nullable|boolean',
            'category_ids'   => 'required|array|min:1',
            'category_ids.*' => 'exists:categories2,category_id',
            'sizes'          => 'required|array|min:1',
            'sizes.*.size'   => 'required|integer|between:3,10',
            'sizes.*.stock'  => 'required|integer|min:0',
            'images'         => 'required|array|min:1|max:5',
            'images.*'       => 'image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $shoe = DB::transaction(function () use ($data, $request) {
            $shoe = Shoe::create([
                'name'        => $data['name'],
                'slug'        => $this->uniqueSlug($data['name']),
                'description' => $data['description'] ?? null,
                'price'       => $data['price'],
                'gender'      => $data['gender'],
                'color'       => $data['color'] ?? null,
                'is_new'      => $data['is_new'] ?? 0,
            ]);

            $shoe->categories()->sync($data['category_ids']);
            $this->saveSizes($shoe, $data['sizes']);
            $this->saveImages($shoe, $request->file('images'), true);

            return $shoe;
        });

        return response()->json(
            $this->format($shoe->load(['images', 'sizes', 'categories'])),
            201
        );
    }

    // PUT /api/admin/shoes/{id}   (multipart mein POST bhejo + _method=PUT)
    public function update(Request $request, int $id)
    {
        $shoe = Shoe::findOrFail($id);

        $data = $request->validate([
            'name'           => 'sometimes|string|max:150',
            'description'    => 'nullable|string',
            'price'          => 'sometimes|numeric|min:0',
            'gender'         => 'sometimes|in:Male,Female,Unisex',
            'color'          => 'nullable|string|max:30',
            'is_new'         => 'nullable|boolean',
            'is_active'      => 'nullable|boolean',
            'category_ids'   => 'sometimes|array|min:1',
            'category_ids.*' => 'exists:categories2,category_id',
            'sizes'          => 'sometimes|array',
            'sizes.*.size'   => 'required_with:sizes|integer|between:3,10',
            'sizes.*.stock'  => 'required_with:sizes|integer|min:0',
            'images'         => 'sometimes|array|max:5',
            'images.*'       => 'image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        DB::transaction(function () use ($shoe, $data, $request) {
            $fields = collect($data)->only([
                'name', 'description', 'price', 'gender', 'color', 'is_new', 'is_active',
            ])->all();

            if (isset($fields['name'])) {
                $fields['slug'] = $this->uniqueSlug($fields['name'], $shoe->shoe_id);
            }

            $shoe->update($fields);

            if (isset($data['category_ids'])) {
                $shoe->categories()->sync($data['category_ids']);
            }
            if (isset($data['sizes'])) {
                $this->saveSizes($shoe, $data['sizes']);
            }
            if ($request->hasFile('images')) {
                $hasMain = ShoeImage::where('shoe_id', $shoe->shoe_id)->where('is_main', 1)->exists();
                $this->saveImages($shoe, $request->file('images'), !$hasMain);
            }
        });

        return response()->json(
            $this->format($shoe->fresh(['images', 'sizes', 'categories']))
        );
    }

    // DELETE /api/admin/shoes/{id}/images/{imageId}
    public function destroyImage(int $id, int $imageId)
    {
        $img = ShoeImage::where('shoe_id', $id)->where('image_id', $imageId)->firstOrFail();

        Storage::disk('public')->delete(Str::after($img->image_url, '/storage/'));
        $wasMain = $img->is_main;
        $img->delete();

        if ($wasMain) {
            ShoeImage::where('shoe_id', $id)->orderBy('display_order')->limit(1)->update(['is_main' => 1]);
        }

        return response()->json(['message' => 'Image deleted']);
    }

    // DELETE /api/admin/shoes/{id}
    public function destroy(int $id)
    {
        $shoe = Shoe::findOrFail($id);

        Storage::disk('public')->deleteDirectory("shoes/{$shoe->shoe_id}");
        $shoe->delete(); // images, sizes aur categories link cascade se khud delete ho jayenge

        return response()->json(['message' => 'Shoe deleted']);
    }
}