package presence.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.targets.Target;
import net.thucydides.core.annotations.Step;

public class EnterTravelHistory implements Task {
    private static final Target THE_TRAVEL_HISTORY_BOX = Target
        .the("Travel History Box")
        .locatedBy(".travel-history");

    @Override
    @Step("Enters their travel history")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Enter
            .theValue("blah")
            .into(THE_TRAVEL_HISTORY_BOX)
        );
    }
}
