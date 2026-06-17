<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactQuery extends Model
{
    use HasFactory;
    
    protected $table = 'contact_queries';
    protected $primaryKey = 'query_id';
    
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'query_date',
        'message',
        'is_read'
    ];
    
    protected $casts = [
        'is_read' => 'boolean',
        'query_date' => 'date'
    ];
    
    // ✅ Disable timestamps
    public $timestamps = false;
}