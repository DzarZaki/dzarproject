<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutPhoto extends Model
{
    protected $fillable = ['file_path', 'thumb_path', 'urutan'];
}