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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('description');
            $table->string('location', 255)->nullable();
            $table->string('status', 50)->default('planning');
            $table->integer('progress')->default(0);
            $table->decimal('budget', 10, 2)->nullable();
            $table->decimal('raised', 10, 2)->default(0);
            $table->integer('beneficiaries')->nullable();
            $table->date('start_date')->nullable();
            $table->string('featured_image', 500)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
