import React, { Fragment } from "react";
import DOMPurify from "dompurify";

function EditorToHtml({ data }) {
  //Header element render
  const onRenderHeader = ({ data }) => {
    const type = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" };
    const Header = type[data.level];
    return <Header>{data.text}</Header>;
  };

  //Paragraph element render
  const onRenderParagraph = ({ data }) => {
    return (
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text) }} />
    );
  };

  //List element render
  const onRenderList = ({ data }) => {
    const type = { unordered: "ul", ordered: "ol" };
    const List = type[data.style];

    return (
      <List>
        {data.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </List>
    );
  };

  //Delimiter element render
  const onRenderDelimiter = () => <hr />;

  //Checklist element render
  const onRenderChecklist = () => {
    return <div>Working on Checklist Support</div>;
  };

  //Quote element render
  const onRenderQuote = ({ data }) => (
    <blockquote>
      {data.text} <cite> {data.caption} </cite>
    </blockquote>
  );

  //Warning element render
  const onRenderWarning = ({ data }) => {
    //TODO: This needs to change for a better warning feedback
    return (
      <blockquote>
        {data.message} <cite> {data.title} </cite>
      </blockquote>
    );
  };

  //Table element render
  const onRenderTable = ({ data }) => {
    const table = data.content.map((row, i) => {
      const cell = row.map((cell, i) => {
        return <th key={i}>{cell}</th>;
      });

      return <tr key={i}>{cell}</tr>;
    });

    return (
      <table>
        <tbody>{table}</tbody>
      </table>
    );
  };

  //Code element render
  const onRenderCode = () => {
    return <div>Working on Code Support</div>;
  };

  //Code element render
  const onRenderEmbed = () => {
    return <div>Working on embed Support</div>;
  };

  const elements = {
    header: onRenderHeader,
    paragraph: onRenderParagraph,
    list: onRenderList,
    delimiter: onRenderDelimiter,
    checklist: onRenderChecklist,
    quote: onRenderQuote,
    warning: onRenderWarning,
    table: onRenderTable,
    code: onRenderCode,
    embed: onRenderEmbed
  };

  return (
    <Fragment>
      {data.blocks.map((item, index) => {
        let Handler = elements[item.type];
        return <Handler key={index} {...item} />;
      })}
    </Fragment>
  );
}

export default EditorToHtml;
