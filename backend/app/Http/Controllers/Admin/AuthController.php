<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminOtpMail;
use Carbon\Carbon;

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

    // ✅ Send OTP for password reset via Email
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:admins,admin_email'
        ]);

        $email = $request->email;
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = Carbon::now()->addMinutes(10);

        // Delete old OTPs for this email
        PasswordReset::where('email', $email)->delete();

        // Save new OTP
        PasswordReset::create([
            'email' => $email,
            'otp' => $otp,
            'expires_at' => $expiresAt
        ]);

        // ✅ Send OTP via Email
        try {
            Mail::to($email)->send(new AdminOtpMail($otp, $email));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to send OTP. Please try again.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP sent to your email successfully'
        ]);
    }

    // ✅ Verify OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        $reset = PasswordReset::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('used', 0)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$reset) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid or expired OTP'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully'
        ]);
    }

    // ✅ Reset Password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:6'
        ]);

        $reset = PasswordReset::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('used', 0)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$reset) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid or expired OTP'
            ], 400);
        }

        // Update admin password
        $admin = Admin::where('admin_email', $request->email)->first();
        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Admin not found'
            ], 404);
        }

        $admin->admin_password = Hash::make($request->password);
        $admin->save();

        // Mark OTP as used
        $reset->used = 1;
        $reset->save();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully'
        ]);
    }
}