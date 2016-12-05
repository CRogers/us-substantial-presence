package presence.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Open;
import net.thucydides.core.annotations.Step;

public class OpenPage implements Task {
    @Override
    @Step("Opens the webpage")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Open.url("file:///site/index.html"));
    }
}
