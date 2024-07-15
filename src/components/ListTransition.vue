<template lang="pug">
TransitionGroup(name="list" class="list" tag="ul")
    slot
</template>

<style scoped lang="scss">
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
