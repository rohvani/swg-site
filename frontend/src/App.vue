<template>
    <div id="app">

        <div>
            <b-navbar toggleable="lg" type="dark" variant="dark">
                <b-navbar-brand @click="state.currentPage = 'Dashboard'" href="#">
                    <img class="logo" src="logo.png"/>
                </b-navbar-brand>

                <b-navbar-toggle target="nav_collapse" />

                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav>
                        <b-nav-item @click="state.currentPage = 'Dashboard'" href="#">Dashboard</b-nav-item>
                    </b-navbar-nav>

                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">

                        <b-nav-item-dropdown v-if="isAuthenticated()" right>
                            <template slot="button-content"><em>Logged in as <b>{{user.username}}</b></em></template>
                            <b-dropdown-item href="#">Profile</b-dropdown-item>
                            <b-dropdown-item v-on:click="logoutUser()" href="#">Log out</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item-dropdown v-else text="Not signed in" right>
                            <b-dropdown-item @click="state.currentPage = 'LoginUser'" href="#">Sign-in</b-dropdown-item>
                            <b-dropdown-item @click="state.currentPage = 'CreateUser'" href="#">Create an account</b-dropdown-item>
                        </b-nav-item-dropdown>

                    </b-navbar-nav>

                </b-collapse>
            </b-navbar>
        </div>

        <component v-bind:user="user"
                   v-bind:state="state"
                   v-on:userModified="user = $event"
                   v-on:stateModified="state = $event"
                   :is="state.currentPage">
        </component>

    </div>
</template>

<script>
    import axios from "axios";

    import Dashboard from './components/Dashboard.vue'
    import LoginUser from './components/LoginUser.vue'
    import CreateUser from './components/CreateUser.vue'

    export default
    {
        name: 'app',

        components: {
            'Dashboard': Dashboard,
            'LoginUser': LoginUser,
            'CreateUser': CreateUser
        },

        data ()
        {
            return {
                user: { },
                state: {
                    currentPage: "Dashboard"
                }
            }
        },

        mounted()
        {
            if (localStorage.getItem('user') )
            {
                var cachedUser = JSON.parse(localStorage.getItem('user'));
                var request = {
                    type:"sessionid",
                    user_name: cachedUser.username,
                    session_id: cachedUser.sessionId
                };

                axios({ method: "POST", "url": "api/login", "data": request, "headers": { "content-type": "application/json" } }).then(result => {
                    if(result.data.message === "success") {
                        this.user = JSON.parse(localStorage.getItem('user'));
                    }
                }, error => {
                    console.error(error);
                });
            }
        },

        watch: {
            user: {
                handler() {
                    localStorage.setItem('user', JSON.stringify(this.user));
                },
                deep: true,
            }
        },

        methods: {
            logoutUser(){
                this.user = { };
            },
            isAuthenticated() {
                return this.user.sessionid !== undefined;
            }
        }
    }
</script>

<style>
    .logo {
        height: 38px;
        margin-right: -1rem;
    }
    .navbar {
        border-bottom: 1px solid #444b50;
    }
    .
</style>
