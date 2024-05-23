import React from 'react';
import { useLoaderData } from 'react-router-dom';

const ShowProfile = () => {
    const [users]=useLoaderData()
    console.log(users)
    return (
        <div>
            
        </div>
    );
};

export default ShowProfile;