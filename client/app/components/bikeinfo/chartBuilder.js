const chartBuilder = {
    distance: {
        id: 'distance',
        label: 'Bike Mileage',
        rowBuilder: (activity, previousValue) => {
            return activity.distance + previousValue;
        }
    }
};

export default chartBuilder;