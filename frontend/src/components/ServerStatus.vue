<template>
    <div id="ServerStatus">

        <b-card v-if="clusters.length == 0" bg-variant="light" header="Server List">
            <b-card-text >
                The server list is currently loading, please wait...
            </b-card-text>
        </b-card>

        <div v-for="cluster in clusters">
            <b-card bg-variant="light" :header="cluster.name">
                <b-card-text >
                    Status: {{ cluster.status }}<br>
                    Population: {{ cluster.population }}<br>
                    Uptime: {{ cluster.uptime }}
                </b-card-text>
            </b-card>
        </div>

    </div>
</template>

<script>
    import axios from "axios";

    export default
    {
        name: 'ServerStatus',

        data ()
        {
            return {
                polling: null,
                clusters: [],
            }
        },

        methods: {
            readableTimeDiff(timeDiff) {
                let result = "";
                if(timeDiff.days > 0) result += timeDiff.days + " days, ";
                if(timeDiff.hours > 0) result += timeDiff.hours + " hours, ";
                if(timeDiff.minutes > 0) result += timeDiff.minutes + " minutes, ";
                return result + timeDiff.seconds + " seconds";
            },
            pollData () {
                this.polling = setInterval(() => {
                    axios({ method: "get", "url": "api/metrics"  }).then(result =>
                    {
                        if(result.data)
                        {
                            this.clusters = [];
                            for(let clusterName in result.data)
                            {
                                let cluster = {
                                    name: clusterName,
                                    status: result.data[clusterName].clusterStatus,
                                    population: result.data[clusterName].clusterPopulation,
                                    uptime: this.readableTimeDiff(result.data[clusterName].clusterUptime)
                                };
                                this.clusters.push(cluster);
                            }
                        }
                    }, error => {
                        console.error(error);
                    });
                }, 5 * 1000)
            }
        },

        beforeDestroy () {
            clearInterval(this.polling)
        },

        created () {
            this.pollData()
        }
    }
</script>

<style>

</style>