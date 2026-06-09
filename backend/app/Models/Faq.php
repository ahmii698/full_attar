<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory;
    
    protected $table = 'faqs';
    protected $primaryKey = 'faq_id';
    protected $fillable = ['question', 'answer', 'category', 'display_order', 'is_active'];
    
    protected $casts = [
        'is_active' => 'boolean'
    ];
}