import Topics from "./components/topics/Topics.vue";
import Topic from "./components/topic/Topic.vue";
import Home from "./components/home/Home.vue";
import Users from "./components/users/Users.vue";
import NewTopic from "./components/add-topic/NewTopic.vue";
import Rules from "./components/rules/Rules.vue";
import ChangePassword from "./components/change-password/ChangePassword.vue";

export const routes = [
    {
        path: "",
        component: Home,
        title: "Home"
    },
    {
        path: "/rules",
        component: Rules,
        title: "Regras"
    },
    {
        path: "/topics",
        component: Topics,
        title: "Topics"
    }, {
        path: "/topics/:id/:title",
        component: Topic,
        title: "Topic",
        name: "topic"
    },
    {
        path: "/:id/topics",
        component: Topics,
        title: "My topics",
        name: "myTopics"
    },
    ,
    {
        path: "/update/topic/:id",
        component: NewTopic,
        title: "Update topic",
        name: "updateTopic"
    }, {
        path: "/users/:username/change/password/:token",
        component: ChangePassword,
        name: "changePassword"
    },
    {
        path: "/add/topic",
        component: NewTopic,
        title: "Add Topic",
        name: "addTopic"
    },
    {
        path: '/users/:id/:user',
        component: Users,
        name: 'users',
        title: "Users"
    }
];