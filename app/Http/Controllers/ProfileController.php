<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $roleData = [];

        if ($user->role === 'anggota') {
            $roleData['active_loans_count'] = 0; // Placeholder
            $roleData['shu_history'] = []; // Placeholder
        } else {
            $roleData['activity_logs'] = \App\Models\UserActivityLog::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();
            
            if ($user->role === 'pengurus') {
                $roleData['active_parameters'] = \App\Models\Setting::all();
            }
            if ($user->role === 'bendahara') {
                $roleData['approved_loans_count'] = 0; // Placeholder
                $roleData['disbursed_loans_count'] = 0; // Placeholder
            }
            if ($user->role === 'ketua') {
                $roleData['approved_decisions_count'] = 0; // Placeholder
            }
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'roleData' => $roleData,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile-photos', 'public');
            $user->profile_photo_path = $path;
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
