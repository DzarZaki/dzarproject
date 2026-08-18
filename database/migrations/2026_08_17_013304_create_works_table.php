<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('works', function (Blueprint $table) {
            $table->id();

            // Kategori wajib untuk jenis "horizontal" & "work" (divalidasi di controller),
            // tidak dipakai untuk jenis "slideshow".
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

            // slideshow  = foto full screen paling atas (tanpa halaman detail)
            // horizontal = kartu di strip foto horizontal landing page
            // work       = kartu persegi di halaman /works
            $table->enum('jenis', ['slideshow', 'horizontal', 'work'])->default('work')->index();

            $table->string('judul')->nullable();
            $table->string('slug')->nullable()->unique();
            $table->string('lokasi')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('youtube_url')->nullable();

            // Hanya untuk jenis "horizontal": lebar kartu di strip.
            $table->enum('ukuran', ['kecil', 'sedang', 'besar'])->nullable();

            $table->unsignedInteger('urutan')->default(0);
            $table->timestamps();

            $table->index(['jenis', 'urutan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};