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
        // Trigger untuk UPDATE
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

        // Trigger untuk DELETE
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("
            DROP TRIGGER IF EXISTS prevent_mutation_update_trigger ON mutations;
            DROP FUNCTION IF EXISTS prevent_mutation_update();
            
            DROP TRIGGER IF EXISTS prevent_mutation_delete_trigger ON mutations;
            DROP FUNCTION IF EXISTS prevent_mutation_delete();
        ");
    }
};
