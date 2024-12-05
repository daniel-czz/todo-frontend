<template>
    <div class="box">
        <div class="task">
            <h3> {{ isUpdate ? 'Update Task' : 'Create task' }} </h3> 

            <input v-model="curTask.title" type="text" placeholder="enter title"> <br>
            <textarea v-model="curTask.description" name="description" id="description" placeholder="enter description"></textarea>
            <div v-if="isUpdate">
                fnished - <input type="checkbox" v-model="curTask.finished" /> 
            </div>
            <div>
                <button @click="submit()"> submit </button>
                <button @click="cancel()"> cancel </button>
            </div>
            
        </div>

        <div>
            <input type="checkbox" id="unfinished" :value="false" v-model="filterCondition" />
            <label for="jack">unfinished</label>

            <input type="checkbox" id="finished" :value="true" v-model="filterCondition" />
            <label for="john">finished</label>
        </div>

        <div class="list">
            <ul>
                <li v-for="task in displayList" 
                    :key="task.id" 
                    :class="{'finished': task.finished, 'unfinished': !task.finished}"
                >
                    <span>{{ task.title }}</span>  
                    <span>{{ task.description }}</span>
                    <div>
                        <button v-if="!task.finished" @click="update(task)"> update </button>
                        <button @click="deleteTask(task.id)"> delete </button>
                    </div>
                </li>
            </ul>
           
        </div>

    </div>
  </template>
  
  <script>
    import api from '@/axios'
    import {nanoid} from 'nanoid'
  
    export default {
        name: 'TodoList',
        data(){
            return {
                isUpdate: false,  
                curTask: { 
                    title: '',
                    description: '',
                    finished: false
                }, 
                todoList: [],  // [{id, title, description, finished}]
                filterCondition: [], // store the filter type 
                displayList: [],
            }
        },
        watch:{
            todoList: {
                handler(){
                    console.log('todoList change!!!');
                    this.filterList()
                }
            }, 
            filterCondition: {
                handler(){
                    console.log('filterCondition change!!!');
                    this.filterList()
                }
            }
        }, 
        mounted(){
            this.getTodoList()
        },
        methods: {
            async getTodoList(){
                try{
                    const response = await api.get('/todo'); 
                    console.log('receiving data -- ', response.data)

                    if(response.data.status) {
                        this.todoList = response.data.data
                        // console.log(1111, this.todoList);
                        this.filterCondition = [true, false]
                    }
                }catch(err){
                    alert(err.message)
                }
            }, 
            
            async createNewTask(){
                try{
                    const task = {
                        id: nanoid(),
                        title: this.curTask.title.trim(),
                        description: this.curTask.description.trim(),
                        finished: false,
                    }
                    console.log(task)
                    const response = await api.post('/todo', task)
                    console.log(response.data);
                    if(response.data.status) { 
                        this.todoList.push(task)
                        this.curTask = {}
                    }
                }catch(err){
                    alert(err.message)
                }
            },

            async updateTask(){
                try{
                    const task = {
                        id: this.curTask.id,
                        title: this.curTask.title.trim(),
                        description: this.curTask.description.trim(),
                        finished: this.curTask.finished,
                    }
                    console.log(task);
                    const response = await api.put(`/todo/${task.id}`, task)
                    if(response.data.status) {
                        this.todoList = [...response.data.data]
                        this.curTask = {}
                        this.isUpdate = false 
                    }
                }catch(err){
                    alert(err.message)
                }
            },

            async deleteTask(id){
                try{
                    const response = await api.delete(`/todo/${id}`)
                    console.log(response.data);
                    if(response.data.status){
                        this.todoList = response.data.data
                    }
                }catch(err){
                    alert(err.message)
                }
            },

            submit(){
                if(!this.curTask.title || !this.curTask.description) {
                    alert('please enter title and description')
                    return 
                }
                if(!this.isUpdate){
                    this.createNewTask()
                }else{
                    this.updateTask()
                }
            }, 

            cancel(){
                this.isUpdate = false 
                this.curTask = {}
            },

            update(task){
                this.isUpdate = true 
                this.curTask = {...task}
            },

            filterList(){
                if(this.filterCondition == 0){
                    this.displayList = []
                }else if(this.filterCondition.length == 1){
                    const condition = this.filterCondition[0]
                    this.displayList = this.todoList.filter((task) => task.finished == condition)
                }else if(this.filterCondition.length == 2){
                    this.displayList = this.todoList
                }
            }


        }
    }
  </script>
  
  <style>
  * {
    padding: 0;
    margin: 0; 
  }

  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .task {
    width: 45%;
    border: 2px solid rebeccapurple;
    text-align: center;
    margin-bottom: 10px;
  }

  .list {
    width: 100%;
  }

  li{
    display: flex;
    justify-content: space-around;
    align-items: center;

    list-style-type: none;
    height: 30px;
    width: 100%;    
    text-align: center;
    margin-bottom: 10px;
  }

  .finished {
    background-color: green;
  }

  .unfinished {
    background-color: gray;
  }
  
  
  </style>