<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique()->after('email');

            $table->string('phone_country_code', 5)->nullable()->change();
            $table->string('phone_number', 15)->nullable()->change();
            $table->string('gender')->nullable()->change();
            $table->date('dob')->nullable()->change();
            $table->string('qualification')->nullable()->change();
            $table->string('work_experience')->nullable()->change();
            $table->string('service')->nullable()->change();
            $table->string('country')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['google_id']);
            $table->dropColumn('google_id');

            $table->string('phone_country_code', 5)->nullable(false)->change();
            $table->string('phone_number', 15)->nullable(false)->change();
            $table->string('gender')->nullable(false)->change();
            $table->date('dob')->nullable(false)->change();
            $table->string('qualification')->nullable(false)->change();
            $table->string('work_experience')->nullable(false)->change();
            $table->string('service')->nullable(false)->change();
            $table->string('country')->nullable(false)->change();
        });
    }
};
