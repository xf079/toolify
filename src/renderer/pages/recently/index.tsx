import EmailIcon from '@/assets/icon/email-icon.svg?react';
import CalendarIcon from '@/assets/icon/calendar-icon.svg?react';
import NotebookIcon from '@/assets/icon/notebook-icon.svg?react';
import TranslationIcon from '@/assets/icon/translation-icon.svg?react';

const items = [
  {
    label: '翻译',
    key: 'translation',
    icon: <TranslationIcon width={22} height={22} />
  },
  {
    label: '日历',
    key: 'calendar',
    icon: <CalendarIcon width={22} height={22} />
  },
  {
    label: '笔记',
    key: 'cipher',
    icon: <NotebookIcon width={22} height={22} />
  },
  {
    label: '发送邮件',
    key: 'notion',
    icon: <EmailIcon width={22} height={22} />
  }
];

function RecentlyPage() {
  const onItemClick = () => {};
  return (
    <div>
      <div>
        <div className='hot-list'>
          {items.map((item) => (
            <div className='hot-item' key={item.key} onClick={onItemClick}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentlyPage;
