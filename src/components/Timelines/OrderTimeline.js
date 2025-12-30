import React from 'react';
import { Timeline, Typography } from 'antd';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const OrderTimeline = ({ timelineData }) => {
  return (
    <div className='px-3' >
      <Title level={4} className="mb-3">Order Timeline</Title>
      <Timeline>
        {timelineData.map((item, index) => (
          <Timeline.Item key={item._id || index} color={
            item.action === 'created'
              ? 'green'
              : item.action === 'updated'
              ? 'blue'
              : item.action === 'cancelled'
              ? 'red'
              : 'gray'
          }>
            <Text strong>{item.action.toUpperCase()}</Text>
            <br />
            <Text type="secondary">
              {dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
            <br />
            <Text>{item.message}</Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default OrderTimeline;
