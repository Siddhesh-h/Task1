<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthenticateWithJwtCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('jwt_token');

        if(!$token){
            return response()->json([
                'message'=> 'Unauthenticated.',
            ], 401);
        }

        try{
            JWTAuth::setToken($token);

            $user = JWTAuth::authenticate();

            if(!$user){
                return response()->json([
                    'message'=> 'Unauthenticated',
                ], 401);
            }

            Auth::guard('api')->setUser($user);


        }catch(\Exception $e){
            return response()->json([
                'message'=> 'Unauthenticated.',
            ], 401);
        }

        return $next($request);
    }
}
