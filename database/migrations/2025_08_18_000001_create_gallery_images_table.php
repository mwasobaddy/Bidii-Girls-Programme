<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('gallery_images', function (Blueprint $table) {
            $table->id();
            $table->string('name');
                // Removed 'path' column
                $table->longText('base64');
            $table->string('category');
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();
            $table->integer('size')->nullable();
            $table->timestamp('last_modified')->nullable();
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('gallery_images');
    }
};
