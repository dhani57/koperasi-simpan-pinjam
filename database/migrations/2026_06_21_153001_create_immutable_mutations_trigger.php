<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            // Trigger untuk UPDATE PostgreSQL
            DB::unprepared("
                CREATE OR REPLACE FUNCTION prevent_mutation_update()
                RETURNS trigger AS $$
                BEGIN
                    RAISE EXCEPTION 'Mutations table is immutable. Updates are not allowed.';
                END;
                $$ LANGUAGE plpgsql;

                CREATE TRIGGER prevent_mutation_update_trigger
                BEFORE UPDATE ON mutations
                FOR EACH ROW
                EXECUTE FUNCTION prevent_mutation_update();
            ");

            // Trigger untuk DELETE PostgreSQL
            DB::unprepared("
                CREATE OR REPLACE FUNCTION prevent_mutation_delete()
                RETURNS trigger AS $$
                BEGIN
                    RAISE EXCEPTION 'Mutations table is immutable. Deletes are not allowed.';
                END;
                $$ LANGUAGE plpgsql;

                CREATE TRIGGER prevent_mutation_delete_trigger
                BEFORE DELETE ON mutations
                FOR EACH ROW
                EXECUTE FUNCTION prevent_mutation_delete();
            ");
        } elseif ($driver === 'sqlite') {
            // Trigger untuk UPDATE SQLite
            DB::unprepared("
                CREATE TRIGGER prevent_mutation_update_trigger
                BEFORE UPDATE ON mutations
                BEGIN
                    SELECT RAISE(ABORT, 'Mutations table is immutable. Updates are not allowed.');
                END;
            ");

            // Trigger untuk DELETE SQLite
            DB::unprepared("
                CREATE TRIGGER prevent_mutation_delete_trigger
                BEFORE DELETE ON mutations
                BEGIN
                    SELECT RAISE(ABORT, 'Mutations table is immutable. Deletes are not allowed.');
                END;
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::unprepared("
                DROP TRIGGER IF EXISTS prevent_mutation_update_trigger ON mutations;
                DROP FUNCTION IF EXISTS prevent_mutation_update();
                
                DROP TRIGGER IF EXISTS prevent_mutation_delete_trigger ON mutations;
                DROP FUNCTION IF EXISTS prevent_mutation_delete();
            ");
        } elseif ($driver === 'sqlite') {
            DB::unprepared("DROP TRIGGER IF EXISTS prevent_mutation_update_trigger;");
            DB::unprepared("DROP TRIGGER IF EXISTS prevent_mutation_delete_trigger;");
        }
    }
};
