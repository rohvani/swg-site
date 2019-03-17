<template>
    <div id="loginUser">
        <b-form>
            <b-form-group label="User Name" label-for="username">
                <b-form-input
                        id="username"
                        type="text"
                        v-model="input.user_name"
                        required
                />
            </b-form-group>
            <b-form-group label="Password" label-for="password">
                <b-form-input
                        id="password"
                        type="password"
                        v-model="input.user_password"
                        required
                        description="Be careful"
                />
            </b-form-group>

            <b-alert variant="danger" dismissible v-model="showDismissibleAlert">
                Dismissible Alert!
            </b-alert>

            <b-alert v-if="serverResponse" show>{{serverResponse}}</b-alert>

            <b-button v-on:click="loginUser()">Login</b-button>

        </b-form>
        
       
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'CreateUser',
        props: ['user', 'state'],
        data () {
            return {
                serverResponse: "",
                input: {
                    user_name: "",
                    user_password: ""
                }
            }
        },
        methods: {
            loginUser() {
                axios({ method: "POST", "url": "api/login", "data": this.input, "headers": { "content-type": "application/json" } }).then(result =>
                {
                    if(result.data.message === "success")
                    {
                        this.state.currentPage = "Dashboard";
                        this.serverResponse = "";

                        this.$emit('userModified', result.data.user);
                        this.$emit('stateModified', this.state);
                    }
                    else {
                        this.serverResponse = result.data.message;
                    }
                }, error => {
                    console.error(error);
                });
            }
        }

    }
</script>

<style>
    #loginUser {
        width: 500px;
        padding-top: 50px;
        margin: auto;
        text-align: center;
    }
    .btn {
        width: 75%;
    }
</style>