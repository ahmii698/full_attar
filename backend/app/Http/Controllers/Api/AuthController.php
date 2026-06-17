<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserOtpMail;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => $user,
                'token' => $token
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 422);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => $user,
                'token' => $token
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        try {
            Log::info('===== UPDATE PROFILE REQUEST =====');
            Log::info('Request data:', $request->all());
            
            $user = $request->user();
            
            if (!$user) {
                Log::error('No authenticated user found');
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            Log::info('Current user ID: ' . $user->user_id);
            Log::info('Current user email: ' . $user->email);
            
            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();
            
            Log::info('User updated successfully');
            Log::info('New user data: name=' . $user->name . ', email=' . $user->email);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Update Profile Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }

    public function changePassword(Request $request)
    {
        try {
            Log::info('===== CHANGE PASSWORD REQUEST =====');
            
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            $validator = Validator::make($request->all(), [
                'current_password' => 'required',
                'new_password' => 'required|min:6',
            ]);

            if ($validator->fails()) {
                Log::error('Password validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            if (!Hash::check($request->current_password, $user->password)) {
                Log::error('Current password is incorrect for user: ' . $user->email);
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();
            
            Log::info('Password changed successfully for user: ' . $user->email);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Change Password Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to change password: ' . $e->getMessage()
            ], 500);
        }
    }

    // ✅ ========== USER FORGOT PASSWORD METHODS ==========

    // Send OTP for User Password Reset
    public function sendUserOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $email = $request->email;
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = Carbon::now()->addMinutes(10);

        PasswordReset::where('email', $email)->delete();

        PasswordReset::create([
            'email' => $email,
            'otp' => $otp,
            'expires_at' => $expiresAt
        ]);

        try {
            Mail::to($email)->send(new UserOtpMail($otp, $email));
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

    // Verify User OTP
    public function verifyUserOtp(Request $request)
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

    // Reset User Password
    public function resetUserPassword(Request $request)
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

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not found'
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        $reset->used = 1;
        $reset->save();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully'
        ]);
    }
}