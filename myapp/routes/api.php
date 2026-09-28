<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;


Route::get('/test', [AuthController::class, "test"]);



Route::post('/register', [AuthController::class, "register"]);
Route::post('/login', [AuthController::class, "login"]);

Route::get('/auth/google', [
    AuthController::class,
    'googleRedirect',
]);

Route::get('/auth/google/callback', [
    AuthController::class,
    'googleCallback',
]);

Route::post('/forgot-password', [
    AuthController::class,
    'forgotPassword',
]);

Route::post('/reset-password', [
    AuthController::class,
    'resetPassword',
]);

Route::get('/user', function () {
    return response()->json(
        Auth::guard('api')->user()
    );
})->middleware('jwt.cookie');

Route::get('/profile', [
    AuthController::class,
    'profile',
])->middleware('jwt.cookie');

Route::put('/profile', [
    AuthController::class,
    'updateProfile',
])->middleware('jwt.cookie');



Route::post("/logout", [AuthController::class, "logout"])->middleware('jwt.cookie');


