<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;
    
    protected $table = 'blogs';              // YEH ADD KARO
    protected $primaryKey = 'blog_id';       // YEH ADD KARO
    protected $fillable = ['title', 'content', 'excerpt', 'image_url', 'category', 'tags', 'author', 'date', 'read_time'];
    
    public $timestamps = true;               // YEH ADD KARO
}