FROM node:12 as node
WORKDIR /pogues
COPY ./ /pogues/
RUN yarn
RUN yarn build:dev

FROM nginx:1.17
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /pogues/dist /usr/share/nginx/html
ADD ./config/start.sh /usr/share/nginx
RUN chmod +x /usr/share/nginx/start.sh
ENTRYPOINT [ "/usr/share/nginx/start.sh"]
CMD nginx -g 'daemon off;'