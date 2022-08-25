import React, { useEffect, useReducer, useState } from "react";
import { TemplateObject, useLoadTemplates } from "./templates";
import { uid } from "./utils/uid";
import "./global.css";
import {
  removeFromArray,
  shiftItem,
  uniqueArray,
  updateInArray,
} from "./utils/immutable-array";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import copy from "copy-text-to-clipboard";
import iconRefresh from "./icons/refresh.svg";
import iconTrash from "./icons/trash.svg";
import iconCopy from "./icons/copy.svg";
import arrowBarUp from "./icons/arrow-bar-up.svg";
import ambulance from "./icons/ambulance.svg";

const events = [
  "add",
  "remove",
  "edit",
  "reset",
  "initialize",
  "move",
] as const;
type Event = typeof events[number];

const SITE_TITLE = "README CREATOR";
const URL_GITHUB = "https://github.com/olmesm/readme";
const TEMPLATE_URL = "/templates/";

const BLURB = `<!--
  Created with ${window.location || URL_GITHUB} tool.
-->`;

type State = {
  documents: TemplateObject[];
  templates: Readonly<TemplateObject>[];
};
const initialState: State = {
  documents: [],
  templates: [],
};

const Icon: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = (props) => <img className="unset-max-width" {...props} />;

const Selector: React.FC<{
  tooltip?: string;
  list: TemplateObject[];
  activeUid?: string;
  primaryAction: (t: TemplateObject) => void;
  additionalActions?: {
    action: (template: TemplateObject) => void;
    title: Event;
    icon: string;
  }[];
}> = ({ tooltip, list, primaryAction, additionalActions, activeUid }) => (
  <>
    {list.map((template) => (
      <div key={template.uid || template.templateId} className="flex">
        <button
          data-tooltip={tooltip}
          onClick={() => primaryAction(template)}
          className={
            activeUid && activeUid === template.uid
              ? "outline"
              : "outline secondary"
          }
        >
          {template.templateId}
        </button>

        {additionalActions && (
          <div className="flex">
            {additionalActions.map((a) => (
              <button
                role="button"
                key={a.title}
                data-tooltip={a.title}
                onClick={() => a.action(template)}
              >
                <Icon src={a.icon} alt={a.title} />
              </button>
            ))}
          </div>
        )}
      </div>
    ))}
  </>
);

const Editor: React.FC<{
  copy?: TemplateObject["originalCopy"];
  setCopy: (s: TemplateObject["originalCopy"]) => void;
}> = ({
  copy = "Select a section from the left document sidebar to edit the contents",
  setCopy,
}) => (
  <textarea
    className="full-height--textarea"
    value={copy}
    onChange={(e) => setCopy(e.target.value)}
  />
);

const View: React.FC<{ markdown: string }> = ({ markdown }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
);

function reducer(
  state: State,
  action:
    | { type: Omit<Event, "initialize">; template: TemplateObject }
    | { type: "initialize"; templateList: TemplateObject[] }
): State {
  const getEventPayloadIndexFromState = () =>
    state.documents.findIndex(
      (d) => d.uid === (action as { template: TemplateObject }).template.uid
    );

  switch (action.type) {
    case "initialize": {
      return Object.assign({}, state, {
        templates: (action as { templateList: TemplateObject[] }).templateList,
      });
    }
    case "move": {
      const eventPayloadIndex = getEventPayloadIndexFromState();

      return Object.assign({}, state, {
        documents: shiftItem(state.documents, eventPayloadIndex, -1),
      });
    }
    case "edit": {
      const eventPayloadIndex = getEventPayloadIndexFromState();

      return Object.assign({}, state, {
        documents: updateInArray(
          state.documents,
          eventPayloadIndex,
          action.template
        ),
      });
    }
    case "add": {
      return Object.assign({}, state, {
        documents: uniqueArray([
          ...state.documents,
          { ...action.template, uid: uid() },
        ]),
      });
    }
    case "remove": {
      const eventPayloadIndex = getEventPayloadIndexFromState();

      return Object.assign({}, state, {
        documents: removeFromArray(state.documents, eventPayloadIndex),
      });
    }
    default:
      throw new Error();
  }
}

const Heading: React.FC<{ title: string; children?: React.ReactNode }> = ({
  children,
  title,
}) => (
  <>
    <div className="flex space-between">
      <h3>{title}</h3>
      <div className="flex">{children}</div>
    </div>
    <hr />
  </>
);

const Segment: React.FC<{
  overflowHidden?: boolean;
  children: React.ReactNode;
}> = ({ overflowHidden, children }) => (
  <div>
    <article
      className={["full-height", overflowHidden && "overflow-hidden"].join(" ")}
    >
      {children}
    </article>
  </div>
);

const CopyModal: React.FC<{
  copied: boolean;
  setCopied: (s: boolean) => void;
}> = ({ copied, setCopied }) => {
  return (
    <dialog open={copied}>
      <article>
        <header>
          <button
            aria-label="Close"
            className="close outline"
            onClick={() => setCopied(false)}
          />
          {SITE_TITLE}
        </header>
        <p>Successfully copied markdown to clipboard</p>
      </article>
    </dialog>
  );
};

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [editorUid, setEditorUid] = useState<string>();
  const [copied, setCopied] = useState<boolean>(false);
  const loadedDoc = state.documents.find((d) => d.uid === editorUid);

  const params = new URL(window.location as unknown as URL).searchParams;
  const templateUrl = params.get("template-url") || TEMPLATE_URL;

  const [isLoading, templates] = useLoadTemplates(decodeURI(templateUrl));

  useEffect(() => {
    dispatch({ type: "initialize", templateList: templates });
  }, [templates]);

  if (isLoading) {
    return (
      <dialog open>
        <article>
          <p aria-busy="true">Loading Templates...</p>
        </article>
      </dialog>
    );
  }

  const markdown = state.documents
    .map((d) => d.alteredCopy || d.originalCopy)
    .join("\n");

  const handleCopyMarkdown = () => {
    copy([BLURB, markdown].join("\n"));
    setCopied(true);
  };

  return (
    <main className="container-fluid">
      <div>
        <nav>
          <ul>
            <li>
              <strong>{SITE_TITLE}</strong>
            </li>
          </ul>
          <ul>
            <li>
              <a className="secondary" href={URL_GITHUB}>
                <Icon src={ambulance} alt="get help" />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <CopyModal copied={copied} setCopied={setCopied} />

      <div className="grid">
        <Segment>
          <Heading title="Documents"></Heading>
          <Selector
            activeUid={editorUid}
            list={state.documents}
            tooltip="Edit"
            additionalActions={[
              {
                title: "move",
                action: (template) => {
                  dispatch({
                    type: "move",
                    template,
                  });
                },
                icon: arrowBarUp,
              },
              {
                title: "reset",
                action: (template) =>
                  dispatch({
                    type: "edit",
                    template: { ...template, alteredCopy: undefined },
                  }),
                icon: iconRefresh,
              },
              {
                title: "remove",
                action: (template) => dispatch({ type: "remove", template }),
                icon: iconTrash,
              },
            ]}
            primaryAction={(template) => setEditorUid(template.uid)}
          />
          <br />
          <Heading title="Templates"></Heading>
          <Selector
            list={templates}
            tooltip="Add"
            primaryAction={(template) => dispatch({ type: "add", template })}
          />
        </Segment>

        <Segment overflowHidden={true}>
          <Heading title="Editor"></Heading>
          <Editor
            copy={loadedDoc?.alteredCopy || loadedDoc?.originalCopy}
            setCopy={(alteredCopy) =>
              loadedDoc &&
              dispatch({
                type: "edit",
                template: { ...loadedDoc, alteredCopy },
              })
            }
          />
        </Segment>

        <Segment>
          <Heading title="View">
            <button data-tooltip="Copy Markdown" onClick={handleCopyMarkdown}>
              <Icon src={iconCopy} alt="" />
            </button>
          </Heading>
          <View markdown={markdown} />
        </Segment>
      </div>

      <div className="flex justify-center">
        <p>
          Code available at <a href={URL_GITHUB}>{URL_GITHUB}</a>
        </p>
      </div>
    </main>
  );
}
