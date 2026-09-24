<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
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

        $user = User::where('email', $validated['email'])->first();

        if(!$user || !Hash::check($validated['password'], $user->password)){
            return response()->json([
                'message'=> 'Invalid email or password'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login Successfull',
            'user' => $user,
            'token' => $token,
        ]);
    }

    //Logout Controller
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logout Successfull'
        ]);
    }
}
