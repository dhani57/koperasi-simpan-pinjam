<?php

namespace App\Services;

use App\Models\Setting;

class DeductionService
{
    /**
     * Determine if a given month is an active deduction month.
     * PRD 6.1 specifies there are inactive months in a year based on parameter sistem.
     *
     * @param int $month (1-12)
     * @return bool
     */
    public function isMonthActive(int $month): bool
    {
        $inactiveMonthsSetting = Setting::where('key', 'inactive_months')->value('value');
        $inactiveMonths = $inactiveMonthsSetting ? json_decode($inactiveMonthsSetting, true) : [];
        
        return !in_array($month, $inactiveMonths);
    }
}
