<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class BackupDatabaseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup the PostgreSQL database using pg_dump';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filename = 'backup-' . now()->format('Y-m-d-H-i-s') . '.sql';
        
        $host = env('DB_HOST', '127.0.0.1');
        $port = env('DB_PORT', '5432');
        $database = env('DB_DATABASE', 'forge');
        $username = env('DB_USERNAME', 'forge');
        $password = env('DB_PASSWORD', '');

        // Pastikan direktori backup ada
        $backupDir = storage_path('app/backups');
        if (!file_exists($backupDir)) {
            mkdir($backupDir, 0755, true);
        }
        $path = $backupDir . '/' . $filename;

        // pg_dump memerlukan password di set via environment variable PGPASSWORD
        $command = sprintf(
            'mkdir -p %s && PGPASSWORD="%s" pg_dump -U %s -h %s -p %s %s > %s',
            $backupDir,
            $password,
            $username,
            $host,
            $port,
            $database,
            $path
        );

        $result = null;
        $output = [];
        exec($command, $output, $result);

        if ($result === 0) {
            $this->info("Database backup created successfully: " . $path);
        } else {
            $this->error("Database backup failed.");
            $this->error(implode("\n", $output));
        }
    }
}
