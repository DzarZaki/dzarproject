<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('abouts', function (Blueprint $table) {
            // Foto memanjang hitam putih khusus landing page, bukan foto halaman About.
            $table->string('foto_pita_path')->nullable()->after('foto_full_thumb');
            $table->string('foto_pita_thumb')->nullable()->after('foto_pita_path');
        });
    }

    public function down(): void
    {
        Schema::table('abouts', function (Blueprint $table) {
            $table->dropColumn(['foto_pita_path', 'foto_pita_thumb']);
        });
    }
};