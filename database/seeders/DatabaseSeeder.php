<?php

namespace Database\Seeders;

use App\Models\About;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin DzarProject',
            'email' => 'admin@dzarproject.test',
            'password' => 'password',
        ]);

        // Satu baris About kosong dengan label & judul bawaan,
        // supaya halaman admin About langsung bisa dibuka.
        About::singleton();
    }
}