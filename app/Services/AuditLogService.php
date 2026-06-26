<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserActivityLog;

class AuditLogService
{
    /**
     * Log an activity to the database.
     *
     * @param User $user
     * @param string $activityType
     * @param string $description
     * @return void
     */
    public function log(User $user, string $activityType, string $description): void
    {
        UserActivityLog::create([
            'user_id' => $user->id,
            'activity_type' => $activityType,
            'description' => $description,
        ]);
    }
}
