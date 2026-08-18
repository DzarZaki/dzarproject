<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abouts', function (Blueprint $table) {
            $table->id();

            // Section 1 — label kecil kiri atas + judul serif + 2 paragraf.
            $table->string('label')->default('About Us');
            $table->string('judul')->default('Authentic Archive');
            $table->text('paragraf_1')->nullable();
            $table->text('paragraf_2')->nullable();

            // Section 1 — foto portrait kecil (rasio 4:5).
            $table->string('foto_portrait_path')->nullable();
            $table->string('foto_portrait_thumb')->nullable();

            // Section 2 — foto full-bleed grayscale.
            $table->string('foto_full_path')->nullable();
            $table->string('foto_full_thumb')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('abouts');
    }
};