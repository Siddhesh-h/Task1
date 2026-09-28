<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Password;
use libphonenumber\PhoneNumberUtil;
use libphonenumber\NumberParseException;

class AuthController extends Controller
{
    public function test() 
    {
        return response()->json([
            'message' => "Test Api running"
        ]);
    }

    //Register Controller
    public function register(Request $request){
        $validated = $request->validate([
            "name" => "required|string|min:3|max:255",
            "email" => "required|email|unique:users,email",


            'phone_country' => [
                'required',
                'in:IN,GB,US,CA,AU,NZ',
            ],

            'phone_country_code' => [
                'required',
                'in:+91,+44,+1,+61,+64',
            ],

            'phone_number' => [
                'required',
                'regex:/^[0-9]{7,15}$/',
            ],

            'gender' => [
                'required',
                'in:Male,Female,Other',
            ],

            'dob' => [
                'required',
                'date',
                'before_or_equal:' . now()->subYears(18)->format('Y-m-d'),
            ],

            'qualification' => [
                'required',
                'string',
                'max:255',
            ],

            'work_experience' => [
                'required',
                'string',
                'max:255',
            ],

            'service' => [
                'required',
                'in:PR Australia,PR Canada,TR Australia,TR Canada,Study Abroad,Post Graduate,Under Graduate,Tourist Visa',
            ],

            'country' => [
                'required',
                'in:UK,USA,Canada,Australia,New Zealand',
            ],
            "password" => "required|string|min:8|confirmed",
        ],
        [
            'email.unique' => 'User already exists. Please login instead',
        ],
        );

        $phoneError = $this->validatePhoneNumber($validated['phone_country'], $validated['phone_number']);

        if ($phoneError) {
            return response()->json([
                'message'=> 'Validation failed.',
                'errors'=> [
                    'phone_number' => [$phoneError],
                ],
            ], 422);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_country' => $validated['phone_country'],
            'phone_country_code' => $validated['phone_country_code'],
            'phone_number' => $validated['phone_number'],
            'gender' => $validated['gender'],
            'dob' => $validated['dob'],
            'qualification' => $validated['qualification'],
            'work_experience' => $validated['work_experience'],
            'service' => $validated['service'],
            'country' => $validated['country'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Registration Successfully',
            'user' => $user,
        ], 201);
    }

    // Login Controller
    public function login(Request $request){
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = [
            'email' => $validated['email'],
            'password' => $validated['password'],
        ];

        if(!$token = Auth::guard('api') -> attempt($credentials)){
            return response()->json([
                'message' => 'Invalid email or password',
            ], 401);
        }

        return response()->json([
            'message' => 'Login Successfull',
            'user' => Auth::guard('api')->user(),
        ])->cookie(
            'jwt_token',
            $token,
            60,
            '/',
            null,
            false,
            true,
            false,
            'Lax'
        );
    }

    //Logout Controller
    public function logout(Request $request){
        try {
            $token = $request->cookie('jwt_token');

            if ($token) {
                JWTAuth::setToken($token);
                JWTAuth::invalidate();
            }

            return response()->json([
                'message' => 'Logout successful',
            ])->withoutCookie('jwt_token');

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Logout failed',
            ], 500);
        }
    }

    private function validatePhoneNumber(?string $country, ?string $phoneNumber): ?string{
        if(!$country || !$phoneNumber){
            return null;
        }

        $cleanNumber = preg_replace('/\D/', '', $phoneNumber);

        if ($country === 'IN') {
            if (!preg_match('/^[6-9][0-9]{9}$/', $cleanNumber)) {
                return 'Please enter a valid 10-digit Indian mobile number.';
            }
        }

        $phoneUtil = PhoneNumberUtil::getInstance();

        try{
            $number = $phoneUtil->parse(
                $phoneNumber,
                $country,
            );

            if(!$phoneUtil->isValidNumberForRegion($number, $country)){
                return 'The phone number is not valid for the selected country.';
            }
        }catch(NumberParseException $e){
            return 'The phone number is not valid';
        }

        return null;
    }

    public function googleRedirect(){
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function googleCallback(){
        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();

            $googleId = $googleUser->getId();
            $email = $googleUser->getEmail();
            $name = $googleUser->getName();

            if (!$email) {
                return redirect(
                    'http://localhost:5173/login?google_error=1'
                );
            }

            // Find user by google id

            $user = User::where('google_id', $googleId)->first();

            //If not found, find user by email

            if (!$user) {
                $user = User::where('email', $email)->first();

                if ($user) {

                    // Existing account already linked to another Google account
                    if (
                        $user->google_id &&
                        $user->google_id !== $googleId
                    ) {
                        return redirect(
                            'http://localhost:5173/login?google_error=1'
                        );
                    }

                    // Link Google account to existing account
                    $user->google_id = $googleId;
                    $user->save();
                }
            }

            //Create a new Google user

            if (!$user) {
                $user = User::create([
                    'name' => $name ?: 'Google User',
                    'email' => $email,
                    'google_id' => $googleId,

                    'password' => Hash::make(Str::random(32)),
                    'phone_country' => null,
                    'phone_country_code' => null,
                    'phone_number' => null,
                    'gender' => null,
                    'dob' => null,
                    'qualification' => null,
                    'work_experience' => null,
                    'service' => null,
                    'country' => null,
                ]);
            }

            //Generate JWT
            $token = Auth::guard('api')->login($user);

            //Put JWT into HttpOnly cookie

            return redirect('http://localhost:5173/dashboard')
                ->withCookie(cookie(
                    'jwt_token',
                    $token,
                    60,
                    '/',
                    null,
                    false,
                    true,
                    false,
                    'Lax'
                ));

        } catch (\Exception $e) {

            return redirect(
                'http://localhost:5173/login?google_error=1'
            );
        }
    }

    public function profile(){
        $user = Auth::guard('api')->user();

        return response()->json([
            'user' => $user,
        ]);
    }

    public function updateProfile(Request $request){
        $user = Auth::guard('api')->user();

        $validated = $request->validate([
            
            'phone_country' => [
                'nullable',
                'in:IN,GB,US,CA,AU,NZ',
            ],
        
            'phone_country_code' => [
                'nullable',
                'string',
                'max:5',
            ],

            'phone_number' => [
                'nullable',
                'string',
                'max:15',
            ],

            'gender' => [
                'nullable',
                'in:Male,Female,Other',
            ],

            'dob' => [
                'nullable',
                'date',
                'before_or_equal:' . now()->subYears(18)->format('Y-m-d'),
            ],

            'qualification' => [
                'nullable',
                'string',
                'max:255',
            ],

            'work_experience' => [
                'nullable',
                'string',
                'max:255',
            ],

            'service' => [
                'nullable',
                'in:PR Australia,PR Canada,TR Australia,TR Canada,Study Abroad,Post Graduate,Under Graduate,Tourist Visa',
            ],

            'country' => [
                'nullable',
                'in:UK,USA,Canada,Australia,New Zealand',
            ],
        ]);

        $phoneError = $this->validatePhoneNumber(
            $validated['phone_country'] ?? null,
            $validated['phone_number'] ?? null
        );

        if ($phoneError) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => [
                    'phone_number' => [$phoneError],
                ],
            ], 422);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function forgotPassword(Request $request){
        $request->validate([
            'email' => [
                'required',
                'email',
            ],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent to your email.',
            ]);
        }

        return response()->json([
            'message' => 'Unable to send password reset link.',
        ], 422);
    }


    public function resetPassword(Request $request){
        $request->validate([
            'token' => [
                'required',
            ],

            'email' => [
                'required',
                'email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $status = Password::reset(
            $request->only(
                'email',
                'password',
                'password_confirmation',
                'token'
            ),
            function ($user, $password) {
                $user->password = Hash::make($password);

                $user->save();

                // If the user has an old remember token,
                // regenerate it.
                $user->setRememberToken(
                    Str::random(60)
                );
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password reset successfully.',
            ]);
        }

        return response()->json([
            'message' => 'Invalid or expired password reset link.',
        ], 422);
    }

    public function changePassword(Request $request){
        $user = Auth::guard('api')->user();

        $validated = $request->validate([
            'current_password' => [
                'required',
                'string',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
