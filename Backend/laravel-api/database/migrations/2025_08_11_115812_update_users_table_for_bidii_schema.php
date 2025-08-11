<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop columns we don't need
            $table->dropColumn(['name', 'email_verified_at', 'remember_token']);
            
            // Rename password to password_hash
            $table->renameColumn('password', 'password_hash');
            
            // Add role column
            $table->string('role', 50)->default('admin')->after('password_hash');
            
            // Email is already unique, no need to change it
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Restore original columns
            $table->string('name');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            
            // Rename back to password
            $table->renameColumn('password_hash', 'password');
            
            // Drop role column
            $table->dropColumn('role');
        });
    }
};
