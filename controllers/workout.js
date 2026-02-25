const Workout = require("../models/Workout"); 
const { errorHandler } = require("../auth"); 

module.exports.addWorkout = (req, res) => {
    let newWorkout = new Workout({
        userId: req.user.id, 
        name: req.body.name,
        duration: req.body.duration, 
    });

    return newWorkout.save()
        .then((result) => res.status(201).send(result)) 
        .catch(error => errorHandler(error, req, res));
};


module.exports.getWorkouts = (req, res) => {
    
    return Workout.find({ userId: req.user.id }) 
        .then(workouts => {
            if (workouts.length > 0) return res.status(200).send({ workouts });
            return res.status(404).send({ message: 'No workouts found' }); // 
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.updateWorkout = (req, res) => {
    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration,
    };

   
    return Workout.findOneAndUpdate({ _id: req.params.workoutId, userId: req.user.id }, updatedWorkout, { new: true })
        .then(workout => {
            if (workout) {
                return res.status(200).send({ 
                    message: 'Workout updated successfully',
                    updatedWorkout: workout 
                });
            }
            return res.status(404).send({ message: 'Workout not found or unauthorized' });
        })
        .catch(error => errorHandler(error, req, res));
};


module.exports.deleteWorkout = (req, res) => {
    Workout.findOneAndDelete({ _id: req.params.workoutId, userId: req.user.id }) 
        .then(workout => {
            if (!workout) {
                return res.status(404).send({ message: "Workout not found or unauthorized" });
            }
            res.status(200).send({ message: "Workout deleted successfully" }); // 200 OK
        })
};

module.exports.completeWorkoutStatus = (req, res) => {
    let updateUpdates = {
        status: 'completed'
    };

    return Workout.findByIdAndUpdate(req.params.id, updateUpdates, { new: true })
        .then(updatedWorkout => {
            if (!updatedWorkout) {
                return res.status(404).send({ message: 'Workout not found' });
            }
            return res.status(200).send({
                message: 'Workout status updated successfully',
                updatedWorkout: updatedWorkout
            });
        })
        .catch(error => errorHandler(error, req, res));
};