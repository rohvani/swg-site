<template>
    <div id="dasboard">
        <p v-if="isAuthenticated()">
            Logged in as '{{user.username}}' with an access level of '{{user.accesslevel}}'
        </p>
        <p v-else>
            You are currently not signed in
        </p>
    </div>
</template>

<script>
    export default {
        name: 'Dashboard', //this is the name of the component
        props: ['user', 'state'],
        methods:{
            isAuthenticated() {
                return this.user.sessionid !== undefined;
            }
        }
    }
</script>

<style>
    #dasboard {
        width: 500px;
        padding-top: 50px;
        margin: auto;
        text-align: center;
    }
</style>