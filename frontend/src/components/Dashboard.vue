<template>
    <div id="dashboard">

        <div class="row">

            <div class="col-sm-8">

                <b-card bg-variant="light"  header="Dashboard">

                    <b-card-text>

                        <p v-if="isAuthenticated()">
                            Logged in as <b>{{user.username}}</b> with an access level of <b>{{user.accesslevel}}</b>
                        </p>
                        <p v-else>
                            You are currently not signed in
                        </p>

                    </b-card-text>

                </b-card>

            </div>

            <div class="col-sm-4">

                <ServerStatus></ServerStatus>

            </div>

        </div>

    </div>
</template>

<script>
    import ServerStatus from './ServerStatus.vue'

    export default
    {
        name: 'Dashboard',

        props: ['user', 'state'],

        components: {
            'ServerStatus': ServerStatus
        },

        methods: {
            isAuthenticated() {
                return this.user.sessionid !== undefined;
            }
        }
    }
</script>

<style>
    body {
        background-color: rgba(0,0,0,.075);
    }
    #dashboard {
        max-width: 60rem;
        padding: 1rem;
        margin: auto;
    }
    .card {
        margin-top: 1rem;
    }
    .card-header {
        color: rgba(255,255,255,.75);
        background-color: rgb(52, 58, 64);
    }
</style>