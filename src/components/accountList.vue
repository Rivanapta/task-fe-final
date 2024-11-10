<template>
    <div id="app">
        <AccountList />
    </div>
</template>

<script>
import AccountList from './components/accountList.vue';

export default {
    name: 'App',
    components: {
        AccountList
    }
};
</script>

<style>
/* Remove scoped here to make sure styles apply globally */
#app {
    background-color: #001f3f;
    /* Dark blue (dongker) background color */
    color: #ffffff;
    /* Light text color for readability */
    min-height: 100vh;
    /* Full viewport height */
    padding: 20px;
    box-sizing: border-box;
}
</style>