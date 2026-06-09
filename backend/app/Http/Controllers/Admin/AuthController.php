<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $admin = Admin::where('admin_email', $request->email)->first();

        if ($admin && Hash::check($request->password, $admin->admin_password)) {
            $token = $admin->createToken('admin-token')->plainTextToken;
            return response()->json([
                'success' => true,
                'token' => $token,
                'admin' => [
                    'admin_id' => $admin->admin_id,
                    'admin_name' => $admin->admin_name,
                    'admin_email' => $admin->admin_email
                ]
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true]);
    }
}