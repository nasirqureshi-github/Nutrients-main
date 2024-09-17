import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';

const { Title } = Typography;

const NutrientsQuantity = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/api/get');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                // Add a row count to the data
                const processedData = result.data.map((item, index) => ({
                    ...item,
                    rowNumber: index + 1,
                    nutrientName: item.n_id.name,
                }));

                setData(processedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        {
            title: 'Row Number',
            dataIndex: 'rowNumber',
            key: 'rowNumber',
            sorter: (a, b) => a.rowNumber - b.rowNumber,
        },
        {
            title: 'Nutrient Name',
            dataIndex: 'nutrientName',
            key: 'nutrientName',
            // filters: [
            //     { text: 'Calcium', value: 'Calcium' },
            //     { text: 'Vitamin D', value: 'Vitamin D' },
            //     { text: 'Adults', value: 'Adults' },
            //     { text: 'Pregnancy', value: 'Pregnancy' },
            //     { text: 'Lactation', value: 'Lactation' },
            // ],
            // onFilter: (value, record) => record.Group.includes(value),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            filters: [
                { text: '0-20', value: '0-20' },
                { text: '21-40', value: '21-40' },
                { text: '41-60', value: '41-60' },
                { text: '61+', value: '61+' },
            ],
            onFilter: (value, record) => {
                const age = parseInt(record.age, 10);
                switch (value) {
                    case '0-20':
                        return age >= 0 && age <= 20;
                    case '21-40':
                        return age >= 21 && age <= 40;
                    case '41-60':
                        return age >= 41 && age <= 60;
                    case '61+':
                        return age >= 61;
                    default:
                        return true;
                }
            },
        },
        {
            title: 'Group',
            dataIndex: 'Group',
            key: 'Group',
            // filters: [
            //     { text: 'Infants_0-12_months', value: 'Infants_0-12_months' },
            //     { text: 'Children', value: 'Children' },
            //     { text: 'Adults', value: 'Adults' },
            //     { text: 'Pregnancy', value: 'Pregnancy' },
            //     { text: 'Lactation', value: 'Lactation' },
            // ],
            // onFilter: (value, record) => record.Group.includes(value),
        },
        {
            title: 'Male Daily Nutrition',
            dataIndex: 'm_daily_nutritions',
            key: 'm_daily_nutritions',
        },
        {
            title: 'Female Daily Nutrition',
            dataIndex: 'f_daily_nutritions',
            key: 'f_daily_nutritions',
        },
    ];

    return (
        <div>
            <Title level={2}>Nutrients Quantity</Title>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="_id"
                pagination={{ pageSize: 6 }}
            />
        </div>
    );
};

export default NutrientsQuantity;
