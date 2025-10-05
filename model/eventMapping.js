import Event from './eventBean.js';
import EventDate from './eventDateBean.js';
import LookUpValue from './lookUpValueModel.js';
import User from './UserModel.js';

// Associations
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });

LookUpValue.hasMany(Event, { foreignKey: 'category', as: 'events' });
Event.belongsTo(LookUpValue, { foreignKey: 'category', as: 'categoryInfo' });

Event.hasMany(EventDate, { foreignKey: 'eventId', as: 'eventDates' });
EventDate.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

export { Event, EventDate, LookUpValue, User };
