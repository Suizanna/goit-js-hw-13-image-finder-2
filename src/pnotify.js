import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

function errorNotification(text) {
  error({
    text: text,
    delay: 2500,
  });
}

export default errorNotification;