import React, { useEffect, useState } from 'react';
import showToast from 'crunchy-toast';
import Task from './../../components/Task/Task';
import { saveListToLocalStorage } from './../../components/util/localstorage';
import './Home.css';

const Home = () => {
    const [taskList, setTaskList] = useState([
        {
            id: 1,
            title: 'Submit Assignment',
            description: 'Nahi to gali padegi',
            priority: 'high',
        },
    ]);
    const [id, setId] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(''); // Corrected variable name
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('pinklist'));
        if (list && list.length > 0) setTaskList(list);
    }, []);

    const clearInputFields = () => {
        setTitle('');
        setDescription('');
        setPriority('');
    };

    const findTaskIndexById = (taskId) => {
        return taskList.findIndex((task) => task.id === taskId);
    };
    const checkRequiredFields = () => {
        if(!title){
            showToast('Title is required !','alert',3000);
            return false;
        }
        if(!description){
            showToast('description is required !','alert',3000);
            return false;
        }
        if(!priority){
            showToast('Priority is required !','alert',3000);
            return false;
        }
            return true;
    }

    const AddTaskToList = () => {
        if(checkRequiredFields() === false){
            return;
        }



        const randomId = Math.floor(Math.random() * 1000);
        const obj = {
            id: randomId,
            title: title,
            description: description,
            priority: priority,
        };

        const newTaskList = [...taskList, obj];

        setTaskList(newTaskList);

        clearInputFields();

        saveListToLocalStorage(newTaskList);
        showToast('Task added successfully !! ', 'success', 3000);
    };

    const removeTaskFromList = (taskId) => {
        const index = findTaskIndexById(taskId);

        if (index !== -1) {
            const tempArray = [...taskList];
            tempArray.splice(index, 1);

            setTaskList(tempArray);

            saveListToLocalStorage(tempArray);
            showToast('Task deleted Successfully!!', 'alert', 3000);
        }
    };

    const setTaskEditable = (taskId) => {
        setIsEdit(true);
        setId(taskId);
        const currentEditTaskIndex = findTaskIndexById(taskId);
        const currentEditTask = taskList[currentEditTaskIndex];
        setTitle(currentEditTask.title);
        setDescription(currentEditTask.description);
        setPriority(currentEditTask.priority); // Corrected variable name
    };

    const UpdateTask = () => {
        if(checkRequiredFields() === false){
            return;
        }
        const indexToUpdate = findTaskIndexById(id);
        const tempArray = [...taskList];
        tempArray[indexToUpdate] = {
            id: id,
            title: title,
            description: description,
            priority: priority, // Corrected variable name
        };
        setTaskList(tempArray);

        saveListToLocalStorage(tempArray);

        setId(0);
        clearInputFields();

        setIsEdit(false);
        showToast('Task Updated  Successfully!!', 'info', 3000);
    };

    return (
        <div className='container'>
            <h1 className='app-title'> 📓Task Buddy 🎯</h1>
            <div className='todo-flex-cont'>
                <div>
                    <h2 className='text-center'> Show List</h2>
                    <div className='task-container'>
                        {taskList.map((taskItem, index) => {
                            const { id, title, description, priority } = taskItem;

                            return (
                                <Task
                                    id={id}
                                    title={title}
                                    description={description}
                                    priority={priority}
                                    key={index}
                                    removeTaskFromList={removeTaskFromList}
                                    setTaskEditable={setTaskEditable}
                                />
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h2 className='text-center'>
                        {isEdit ? `Update Task ${id}` : 'Add Task'}
                    </h2>
                    <div className='add-task-form-container'>
                        <form>
                            <input
                                type='text'
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                                placeholder='Enter Title'
                                className='task-input'
                            />

                            <input
                                type='text'
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                placeholder='Enter Description'
                                className='task-input'
                            />

                            <input
                                type='text'
                                value={priority}
                                onChange={(e) => {
                                    setPriority(e.target.value);
                                }}
                                placeholder='Enter priority'
                                className='task-input'
                            />

                            <div className='d-flex-btn'>
                                <button
                                    className='btn-add-task'
                                    type='button'
                                    onClick={() => {
                                        isEdit ? UpdateTask() : AddTaskToList();
                                    }}
                                >
                                    {isEdit ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;