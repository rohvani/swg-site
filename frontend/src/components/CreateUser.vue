<template>
    <div id="createUser">
        <b-form>
            <b-form-group label="User Name" label-for="username">
                <b-form-input
                        id="username"
                        type="text"
                        v-model="input.user_name"
                        required
                />
            </b-form-group>
            <b-form-group label="Email Address" label-for="email_address">
                <b-form-input
                        id="email_address"
                        type="text"
                        v-model="input.user_email"
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

            <b-button v-on:click="createUser()">Create Account</b-button>

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
                    user_email: "",
                    user_password: ""
                }
            }
        },
        methods: {
            createUser() {
                axios({ method: "POST", "url": "api/register", "data": this.input, "headers": { "content-type": "application/json" } }).then(result =>
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
    #createUser {
        width: 500px;
        padding-top: 50px;
        margin: auto;
        text-align: center;
    }
    .btn {
        width: 100%;
    }
</style>