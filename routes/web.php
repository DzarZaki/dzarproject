<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\WorkController;
use App\Http\Controllers\Admin\PhotoController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\KontakController;



Route::get('/about', [HomeController::class, 'about'])->name('about');


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/works', [PortfolioController::class, 'index'])->name('works.index');
Route::get('/works/{work:slug}', [PortfolioController::class, 'show'])->name('works.show');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
});

Route::post('/logout', [LoginController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

Route::post('/kontak', [KontakController::class, 'kirim'])->name('kontak.kirim');



Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
    return Inertia::render('Admin/Dashboard', [
        'statistik' => [
            'categories' => \App\Models\Category::count(),
            'works' => \App\Models\Work::count(),
            'videos' => \App\Models\Video::count(),
        ],
    ]);
})->name('dashboard');

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('works', WorkController::class)->except(['show']);

    Route::get('works/{work}/photos', [PhotoController::class, 'index'])->name('works.photos.index');
    Route::post('works/{work}/photos', [PhotoController::class, 'store'])->name('works.photos.store');
    Route::post('works/{work}/photos/drive', [PhotoController::class, 'storeFromDrive'])->name('works.photos.drive');
    Route::patch('photos/{photo}', [PhotoController::class, 'update'])->name('photos.update');
    Route::delete('photos/{photo}', [PhotoController::class, 'destroy'])->name('photos.destroy');

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('works', WorkController::class)->except(['show']);
    Route::resource('videos', VideoController::class)->except(['show']); 

    Route::get('about', [\App\Http\Controllers\Admin\AboutController::class, 'edit'])->name('about.edit');
Route::put('about', [\App\Http\Controllers\Admin\AboutController::class, 'update'])->name('about.update');
Route::post('about/photos', [\App\Http\Controllers\Admin\AboutController::class, 'storePhoto'])->name('about.photos.store');
Route::patch('about/photos/{aboutPhoto}', [\App\Http\Controllers\Admin\AboutController::class, 'updatePhoto'])->name('about.photos.update');
Route::delete('about/photos/{aboutPhoto}', [\App\Http\Controllers\Admin\AboutController::class, 'destroyPhoto'])->name('about.photos.destroy');
    });

    Route::get('/sitemap.xml', function () {
    return response()
        ->view('sitemap', ['works' => \App\Models\Work::orderByDesc('updated_at')->get(['slug', 'updated_at'])])
        ->header('Content-Type', 'application/xml');
});