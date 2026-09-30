<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category2;
use App\Models\Shoe;
use Illuminate\Http\Request;

class ShoeController extends Controller
{
    private function csv($value): array
    {
        return array_filter(array_map('trim', explode(',', (string) $value)));
    }

    private function format(Shoe $shoe, bool $detail = false): array
    {
        $main = $shoe->images->firstWhere('is_main', 1) ?? $shoe->images->first();

        // Image ka sirf path bhejte hain (/storage/shoes/1/a.jpg).
        // Poora URL React banata hai STORAGE_URL se, taake live par bhi sahi chale.
        $data = [
            'id'         => $shoe->shoe_id,
            'name'       => $shoe->name,
            'slug'       => $shoe->slug,
            'price'      => $shoe->price,
            'gender'     => $shoe->gender,
            'color'      => $shoe->color,
            'is_new'     => $shoe->is_new,
            'categories' => $shoe->categories->pluck('name')->implode(' / '),
            'image'      => $main ? $main->image_url : null,
        ];

        if ($detail) {
            $data['description'] = $shoe->description;
            $data['images'] = $shoe->images->map(fn ($i) => [
                'id'      => $i->image_id,
                'url'     => $i->image_url,
                'is_main' => (bool) $i->is_main,
            ])->values();
            $data['sizes'] = $shoe->sizes->map(fn ($s) => [
                'size'     => $s->size,
                'stock'    => $s->stock,
                'in_stock' => $s->stock > 0,
            ])->values();
        }

        return $data;
    }

    // GET /api/shoe-categories
    public function categories()
    {
        return response()->json(Category2::orderBy('category_id')->get(['category_id', 'name']));
    }

    // GET /api/shoes?category=Running,Sneakers&gender=Male&size=8,9&color=Red&sort=price_asc
    public function index(Request $request)
    {
        $q = Shoe::with(['images', 'categories'])->where('is_active', 1);

        if ($request->filled('category')) {
            $q->whereHas('categories', fn ($c) => $c->whereIn('name', $this->csv($request->category)));
        }
        if ($request->filled('gender')) {
            $q->whereIn('gender', $this->csv($request->gender));
        }
        if ($request->filled('size')) {
            $q->whereHas('sizes', fn ($s) => $s->whereIn('size', $this->csv($request->size))->where('stock', '>', 0));
        }
        if ($request->filled('color')) {
            $q->whereIn('color', $this->csv($request->color));
        }

        match ($request->query('sort')) {
            'price_desc' => $q->orderBy('price', 'desc'),
            'newest'     => $q->orderBy('created_at', 'desc'),
            default      => $q->orderBy('price', 'asc'),
        };

        return response()->json(
            $q->get()->map(fn ($s) => $this->format($s))->values()
        );
    }

    // GET /api/shoes/{id ya slug}   (dono chalenge: /shoes/1 aur /shoes/air-max-dn)
    public function show(string $key)
    {
        $shoe = Shoe::with(['images', 'sizes', 'categories'])
            ->where('is_active', 1)
            ->where(function ($q) use ($key) {
                if (ctype_digit($key)) {
                    $q->where('shoe_id', (int) $key);
                } else {
                    $q->where('slug', $key);
                }
            })
            ->firstOrFail();

        return response()->json($this->format($shoe, true));
    }
}