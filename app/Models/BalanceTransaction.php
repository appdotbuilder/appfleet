<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\BalanceTransaction
 *
 * @property int $id
 * @property int $user_id
 * @property string $type
 * @property float $amount
 * @property string $description
 * @property string|null $reference
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BalanceTransaction whereUserId($value)
 * @method static \Database\Factories\BalanceTransactionFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class BalanceTransaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'description',
        'reference',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}