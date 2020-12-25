import React from 'react';
import {Card, CardContent, Typography} from '@material-ui/core';

function InfoBox({title, cases, total, }) {
    return (
        <Card className="infoBox">
            <CardContent>
                {/* Cases */}
                <Typography className="infoBox__title" color="textSecondary" variant="subtitle2">
                    {title}
                </Typography>
                
                {/* +120k  */}
                <h2 className="infoBox__cases">{cases} Today</h2>

                {/* 1.2M */}
                <Typography className="infoBox__total" color="textSecondary" variant="subtitle2">
                    {total} Total
                </Typography>
            </CardContent>
            
        </Card>
    )
}

export default InfoBox
