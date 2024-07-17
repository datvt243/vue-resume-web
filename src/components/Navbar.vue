<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const yearNow = new Date().getFullYear()
</script>

<template>
    <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="#">Resume API</a>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Register</a>
            </li>
        </ul>
        <div class="ms-auto">
            <!-- Split dropup button -->
            <Dropdown :text="'Xin chào, User'" :style="'outline-light'" split>
                <li><a class="dropdown-item" href="#">Logout</a></li>
            </Dropdown>
        </div>
    </nav>
</template>
